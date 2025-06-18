
export const AuthHeader = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-20 scale-110"></div>
        <img 
          src="/lovable-uploads/6d9ab694-126c-44a1-9920-f40be00112b1.png"
          alt="Uteroo Character"
          className="w-[200px] h-[200px] object-contain drop-shadow-2xl relative z-10"
        />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-lg text-gray-600">
          Join Uteroo and start your journey! ✨
        </p>
      </div>
    </div>
  );
};
