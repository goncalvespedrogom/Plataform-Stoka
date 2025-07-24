import { useState } from "react";
import LogoStoka from "../assets/LogoStoka.png";
import Image from "next/image";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/router";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      setError(err.message || "Erro ao enviar e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-gray-100 gap-x-6">
      {/* Esquerda: Formulário */}
      <div className="flex items-center h-full w-[70%]">
        <div className="h-[80vh] w-full bg-[#fff] flex flex-col justify-center items-center rounded-tr-3xl rounded-br-3xl shadow-lg">
          <div className="w-full flex flex-col items-center">
            <div className="max-w-sm mx-auto w-full flex flex-col">
              <h2 className="text-4xl font-bold text-[#000000ee] mb-2 text-left">Recuperar senha</h2>
              <p className="text-[#8a8a8a] mb-12 max-w-xs w-full text-left">Informe seu e-mail cadastrado para receber o link de redefinição de senha.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-0 bg-transparent shadow-none border-none w-full">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="border p-2 px-4 mb-2 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 w-full"
                  disabled={!!message}
                />
                <button
                  type="submit"
                  disabled={loading || !!message}
                  className="bg-black text-white font-medium p-2 mt-2 rounded hover:opacity-85 w-full"
                >
                  {loading ? "Enviando..." : "Enviar"}
                </button>
                {message && <div className="text-green-600 text-sm">{message}</div>}
                {error && <div className="text-red-600 text-sm">{error}</div>}
              </form>
              <button
                type="button"
                className="mt-4 text-sm text-[#8a8a8a] hover:underline text-left"
                onClick={() => router.push("/login")}
              >
                Voltar para a tela de login
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Direita: Logo */}
      <div className="w-[30%] h-full bg-gray-100 flex items-center justify-center pr-2">
        <Image src={LogoStoka} alt="Logo STOKA" className="drop-shadow-lg" style={{maxWidth: 275, width: '100%', height: 'auto'}} />
      </div>
    </div>
  );
} 