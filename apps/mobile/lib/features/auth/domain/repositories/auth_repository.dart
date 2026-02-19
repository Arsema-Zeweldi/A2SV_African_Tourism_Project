

import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/features/auth/domain/entities/user.dart';

abstract class AuthRepository {
  // SIGN UP
  Future<Either<Failure, User>> signUp({
    required String fullName,
    required String email,
    required String password,
  });

  // LOG IN
  Future<Either<Failure, User>> logIn({
    required String email, 
    required String password,
  });

  // CHANGE PASSWORD USING EMAIL AS IDENTIFIER
  Future<Either<Failure, void>> sendPasswordResetEmail({
    required String email,
  });

  // LOG OUT
  Future<Either<Failure, void>> logOut();

  // SIGN IN WITH GOOGLE
  Future<Either<Failure, User>> signInWithGoogle();

  // GET CURRENTLY LOGGED IN USER
  Future<Either<Failure, User?  >> getCurrentUser();
}

