import { Star } from "lucide-react";
import StarRating from "./StarRating";

const ReviewSummary = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews;

  // Tính phân bổ số sao
  const starCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percent: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    };
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 text-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Customer Reviews Summary</h2>

      {/* Average rating */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl font-bold text-emerald-400">
          {averageRating.toFixed(1)}
        </span>
        <div>
          <StarRating rating={averageRating} size={20} />
          <p className="text-sm text-gray-400">
            Based on {totalReviews}{" "}
            {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {/* Distribution */}
      <div className="space-y-2">
        {starCounts.map(({ star, count, percent }) => (
          <div key={star} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{star}</span>
            </div>
            <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-10 text-sm text-gray-300 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary;
