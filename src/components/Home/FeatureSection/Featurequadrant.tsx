export default function FeatureQuadrant({ 
  topLeftIcon,
  bottomRightIcon,
  topLeftImage,
  bottomRightSVG, // nuevo prop para SVG
  activeColor = "bg-teal-500",
  inactiveColor = "bg-teal-50/30",
  size = 400,
  backgroundCircleColor = "bg-[#B4ECF0]" // color del círculo de fondo
}) {
  const bgSize = size * 0.7; // tamaño del círculo de fondo (70% del principal)

  return (
    <div className="flex justify-center items-center">
      <div className="relative" style={{ width: size, height: size }}>
        
        <div
          className={`absolute rounded-full ${backgroundCircleColor}`}
          style={{
            width: bgSize,
            height: bgSize,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0
          }}
        />


        <div 
          className="relative rounded-full overflow-hidden"
          style={{ width: size, height: size, zIndex: 1 }}
        >
  
          <div 
            className={`${activeColor} absolute top-0 left-0 w-1/2 h-1/2 rounded-tl-full`}
          >
            <div
              className="absolute rounded-full bg-white shadow-lg"
              style={{
                top: '60%',
                left: '60%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {topLeftImage ? (
                <img 
                  src={topLeftImage} 
                  alt="Top Left" 
                  className="w-20 h-20 object-cover rounded-full"
                />
              ) : (
                topLeftIcon
              )}
            </div>
          </div>

 
          <div 
            className={`${activeColor} absolute bottom-0 right-0 w-1/2 h-1/2 rounded-br-full`}
          >
            <div
              className="absolute bg-white rounded-full shadow-lg flex items-center justify-center"
              style={{
                top: '40%',
                left: '40%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px'
              }}
            >
              {bottomRightSVG ? bottomRightSVG : bottomRightIcon}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
