"use client";

import { ReviewType } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import { getAllReviews } from "@/db/actions/review.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserIcon } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/product/Rating";

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
  
    
  // fetch review after created or updated
  const reload = async () => {
    const reviews = await getAllReviews({ productId });
    setReviews([...reviews.data]);
  }
  
  useEffect(() => {
    
    const loadReviews = async () => {
        const reviews = await getAllReviews({ productId });
        setReviews(reviews.data);
    }
    
    loadReviews();
      
  }, [productId]);
  
  return (
    <div className="space-y-4">
          {reviews.length === 0 && (<div>No reviews yet.</div>)}
          { userId ? (
              <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
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
              {reviews.map(review => (
                  <Card key={review.id}>
                      <CardHeader>
                          <div className="flex-between">
                              <CardTitle>{ review.title }</CardTitle>
                          </div>
                          <CardDescription>{ review.description }</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                              {/* rating */}
                              <Rating value={review.rating}/>
                              <div className="flex items-center">
                                  <UserIcon className="mr-1 h-3 w-3" />
                                  { review.user?.name ? review.user?.name : 'User'}
                              </div>
                              <div className="flex items-center">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  { formatDateTime(review.createdAt!).dateTime }
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
    </div>
  )
}

export default ReviewList;
