"use client";

import { ReviewType } from "@/types";
import Link from "next/link";
import { useState } from "react";
import ReviewForm from "./ReviewForm";

function ReviewList({
    userId,
    productId,
    productSlug,
}: {
    userId: string;
    productId: string;
    productSlug: string;
}) {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  return (
    <div className="space-y-4">
          {reviews.length === 0 && (<div>No reviews yet.</div>)}
          { userId ? (
              <ReviewForm userId={userId} productId={productId} />
          ) : (
                <div>
                      Please
                      <Link
                          href={`/sign-in?callbackUrl=/product/${productSlug}`}
                          className="text-blue-700 px-2"
                      >
                          Sign In
                      </Link> to write a review.
                </div>
          )}
          <div className="flex flex-col gap-3">
              {/* reviews */}
          </div>
    </div>
  )
}

export default ReviewList;
