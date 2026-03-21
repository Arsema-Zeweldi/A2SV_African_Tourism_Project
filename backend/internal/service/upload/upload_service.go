package upload

import (
	"context"
	"errors"
	"fmt"
	"io"
	"mime/multipart"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var (
	// ErrFileTooLarge is returned when the uploaded file exceeds the allowed size.
	ErrFileTooLarge = errors.New("file size exceeds the allowed limit")
	// ErrInvalidFileType is returned when the uploaded file type is not supported.
	ErrInvalidFileType = errors.New("invalid file type")
)

const (
	MaxImageSize = 10 * 1024 * 1024  // 10MB
	MaxVideoSize = 100 * 1024 * 1024 // 100MB
)

// UploadService provides methods for handling file uploads to Cloudinary.
type UploadService interface {
	// UploadImage uploads an image to Cloudinary with predefined transformations.
	UploadImage(ctx context.Context, file multipart.File, folder string) (string, error)
	// UploadVideo uploads a video to Cloudinary with predefined transformations.
	UploadVideo(ctx context.Context, file multipart.File, folder string) (string, error)
	// DeleteFile deletes a file from Cloudinary by its public ID.
	DeleteFile(ctx context.Context, publicID string) error
}

type uploadServiceImpl struct {
	cld *cloudinary.Cloudinary
}

// NewUploadService creates a new instance of UploadService using the provided configuration.
func NewUploadService(cfg *config.Config) (UploadService, error) {
	if cfg.CloudinaryURL == "" {
		return nil, errors.New("CLOUDINARY_URL is not set")
	}
	cld, err := cloudinary.NewFromURL(cfg.CloudinaryURL)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}
	return &uploadServiceImpl{cld: cld}, nil
}

func (s *uploadServiceImpl) UploadImage(ctx context.Context, file multipart.File, folder string) (string, error) {
	// 1. Check file size
	size, err := getFileSize(file)
	if err != nil {
		return "", err
	}
	if size > MaxImageSize {
		return "", ErrFileTooLarge
	}

	// 2. Reset file pointer
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return "", fmt.Errorf("failed to reset file pointer: %w", err)
	}

	// 3. Upload to Cloudinary
	resp, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:         fmt.Sprintf("africa-tourism/%s", folder),
		Transformation: "w_1200,h_800,c_fill,q_auto,f_auto",
		ResourceType:   "image",
	})
	if err != nil {
		return "", fmt.Errorf("cloudinary upload failed: %w", err)
	}

	return resp.SecureURL, nil
}

func (s *uploadServiceImpl) UploadVideo(ctx context.Context, file multipart.File, folder string) (string, error) {
	// 1. Check file size
	size, err := getFileSize(file)
	if err != nil {
		return "", err
	}
	if size > MaxVideoSize {
		return "", ErrFileTooLarge
	}

	// 2. Reset file pointer
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return "", fmt.Errorf("failed to reset file pointer: %w", err)
	}

	// 3. Upload to Cloudinary
	resp, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:         fmt.Sprintf("africa-tourism/%s", folder),
		Transformation: "q_auto,vc_auto",
		ResourceType:   "video",
	})
	if err != nil {
		return "", fmt.Errorf("cloudinary upload failed: %w", err)
	}

	return resp.SecureURL, nil
}

func (s *uploadServiceImpl) DeleteFile(ctx context.Context, publicID string) error {
	_, err := s.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	if err != nil {
		return fmt.Errorf("cloudinary delete failed: %w", err)
	}
	return nil
}

func getFileSize(file multipart.File) (int64, error) {
	size, err := file.Seek(0, io.SeekEnd)
	if err != nil {
		return 0, fmt.Errorf("failed to get file size: %w", err)
	}
	return size, nil
}
