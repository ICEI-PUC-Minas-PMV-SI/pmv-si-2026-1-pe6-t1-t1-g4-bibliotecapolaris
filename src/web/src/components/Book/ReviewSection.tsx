type Review = {
  id: string;
  rating: number;
  description?: string;
  date: string;
};

type ReviewSectionProps = {
  reviews: Review[];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-(--text) p-6 rounded-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-2xl font-bold tracking-wider uppercase border-b-2 border-yellow-400 pb-1">
          Avaliação
        </h3>
        <StarRating rating={review.rating} />
      </div>
      <p className="font-sans font-light text-base text-justify leading-relaxed line-clamp-4">
        {review.description}
      </p>
    </div>
  );
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <>
        <h2 className="font-serif text-3xl uppercase mb-6">Avaliações</h2>
        <p className="text-gray-400">Nenhuma avaliação ainda.</p>
      </>
    );
  }

  return (
    <>
      <h2 className="font-serif text-3xl uppercase mb-6">Avaliações</h2>
      <div className="grid grid-cols-2 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </>
  );
}