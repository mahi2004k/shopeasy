import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function DealsSlider({ deals }) {

  const navigate = useNavigate();

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation
      autoplay={{ delay: 3000 }}
      loop={true}
    >
      {deals.map(deal => (
        <SwiperSlide key={deal.title}>
          <div
            className="deal-slide"
            onClick={() => navigate("/deals", { state: deal })}
          >
            <img src={deal.image} alt={deal.title} />
            <div className="deal-content">
              <h2>{deal.title}</h2>
              <p>{deal.discount}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}