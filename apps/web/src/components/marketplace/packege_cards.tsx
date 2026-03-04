// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { Package } from '@/lib/marketplace-data';
// import { useMarketplace } from '@/context/marketplace-context';
// import { Heart } from 'lucide-react';

// interface PackageCardProps {
//   package: Package;
// }

// export function PackageCard({ package: pkg }: PackageCardProps) {
//   const { toggleWishlist, isInWishlist, addToCart } = useMarketplace();
//   const inWishlist = isInWishlist(pkg.id);

//   return (
//     <div className="overflow-hidden rounded-lg border border-border bg-background hover:shadow-lg transition-shadow">
//       {/* Image Container */}
//       <div className="relative overflow-hidden bg-muted h-52 w-full">
//         <Image
//           src={pkg.image}
//           alt={pkg.title}
//           fill
//           className="object-cover"
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
//         />
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             toggleWishlist(pkg);
//           }}
//           className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
//             inWishlist
//               ? 'bg-primary text-primary-foreground'
//               : 'bg-white/90 hover:bg-white'
//           }`}
//         >
//           <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
//         </button>
//       </div>

//       {/* Content */}
//       <div className="p-4 flex flex-col gap-3">
//         {/* Title */}
//         <h3 className="font-semibold text-base line-clamp-2">{pkg.title}</h3>

//         {/* Rating & Reviews */}
//         <div className="flex items-center gap-2">
//           <div className="flex">
//             {[...Array(5)].map((_, i) => (
//               <span
//                 key={i}
//                 className={`text-base ${i < Math.round(pkg.rating) ? 'text-primary' : 'text-muted'}`}
//               >
//                 ★
//               </span>
//             ))}
//           </div>
//           <span className="text-sm text-muted-foreground">
//             {pkg.rating} • {pkg.reviews} reviews
//           </span>
//         </div>

//         {/* Duration */}
//         <p className="text-sm text-muted-foreground">{pkg.duration}</p>

//         {/* Price & Button */}
//         <div className="flex items-center justify-between mt-2">
//           <div>
//             <p className="text-xs text-muted-foreground">From</p>
//             <p className="text-xl font-bold text-primary">${pkg.price.toLocaleString()}</p>
//           </div>
//           <button
//             onClick={() => addToCart(pkg)}
//             className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm transition-colors"
//           >
//             Book
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
