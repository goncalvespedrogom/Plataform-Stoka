import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendPasswordResetEmail } from "firebase/auth";

const LoginForm: React.FC = () => {
  console.log("LoginForm renderizou");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Remover estados e funções relacionados ao modal de recuperação de senha

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redireciona para a home/dashboard
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tentando enviar e-mail de recuperação para:', resetEmail);
    setResetError("");
    setResetMessage("");
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      console.log('E-mail de recuperação enviado com sucesso!');
      // Não fechar o modal automaticamente
    } catch (err: any) {
      setResetError(err.message || "Erro ao enviar e-mail de recuperação.");
      console.error('Erro ao enviar e-mail de recuperação:', err);
    } finally {
      setResetLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto p-0 bg-transparent shadow-none border-none w-full">
      <h2 className="text-4xl font-bold text-[#000000ee]">Bem-vindo novamente,</h2>
      <p className="text-[#8a8a8a] mt-[-.8rem] mb-6">por favor, preencha seus dados.</p>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border p-2 px-4 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 w-full"
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border p-2 px-4 pr-12 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 w-full"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a8a8a] hover:text-gray-600 focus:outline-none"
        >
          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
      <button
        type="button"
        className="text-sm text-[#8a8a8a] hover:underline text-left mb-2 w-fit ml-1"
        tabIndex={-1}
        style={{marginTop: '-.4rem'}}
        onClick={() => router.push('/forgot-password')}
      >
        Esqueceu sua senha?
      </button>
      <button type="submit" disabled={loading} className="bg-black text-white font-medium p-2 mt-6 rounded hover:opacity-85 w-full">
        {loading ? "Entrando..." : "Entrar"}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="mt-2 ml-1 text-sm text-[#8a8a8a]">
        Não possui uma conta?{' '}
        <button 
          type="button" 
          className="font-bold text-black hover:underline"
          onClick={() => router.push('/register')}
        >
          Cadastre-se
        </button>
      </div>
      {/* Remover o código do modal de recuperação de senha */}
    </form>
  );
};

export default LoginForm; 