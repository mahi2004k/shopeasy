import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function DealsSlider({ deals }) {

  const navigate = useNavigate();

  if (!deals || deals.length === 0) {
    return <p>No deals available 😢</p>;
  }

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={deals.length > 3}   // ✅ FIX: enable loop only when enough slides
      spaceBetween={20}
      slidesPerView={1}

      breakpoints={{
        640: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }}
    >
      {deals.map((deal) => (

        <SwiperSlide key={deal.id}>

          <div
            className="deal-slide"
            onClick={() => navigate("/deals", { state: deal })}
            style={{ cursor: "pointer" }}
          >

            <img
              src={deal.image || "https://via.placeholder.com/300x200"}
              alt={deal.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover"
              }}
            />

            <div className="deal-content">
              <h2>{deal.title}</h2>
              <p>Discount: {deal.discount}%</p>
            </div>

          </div>

        </SwiperSlide>

      ))}
    </Swiper>
  );
}