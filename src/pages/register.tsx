import RegisterForm from "../components/Auth/RegisterForm";
import LogoStoka from "../assets/LogoStoka.png";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="w-screen h-screen flex bg-gray-100 gap-x-6">
      {/* Esquerda: Formulário */}
      <div className="flex items-center h-full w-[70%] md:w-[70%] w-full px-4 md:px-0">
        <div className="h-[80vh] w-full bg-[#fff] flex flex-col justify-center items-center rounded-tr-3xl rounded-br-3xl md:rounded-tr-3xl md:rounded-br-3xl rounded-3xl shadow-lg">
          <div className="w-full flex flex-col items-center">
            <RegisterForm />
          </div>
        </div>
      </div>
      {/* Direita: Logo */}
      <div className="w-[30%] h-full bg-gray-100 flex items-center justify-center pr-2 hidden md:flex">
        <Image src={LogoStoka} alt="Logo STOKA" className="drop-shadow-lg" style={{maxWidth: 275, width: '100%', height: 'auto'}} />
      </div>
    </div>
  );
} 