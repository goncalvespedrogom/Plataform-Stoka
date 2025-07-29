import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Cadastro realizado com sucesso! Redirecionando para login...");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Aguarda 2 segundos para mostrar a mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 max-w-sm mx-auto p-0 bg-transparent shadow-none border-none w-full px-4 sm:px-0">
      <h2 className="text-[1.5rem] sm:text-3xl md:text-4xl font-bold text-[#000000ee]">Crie sua conta,</h2>
      <p className="text-[#8a8a8a] mt-[-.8rem] mb-6 text-sm sm:text-base">preencha seus dados para começar.</p>
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
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="border p-2 px-4 pr-12 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 w-full"
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a8a8a] hover:text-gray-600 focus:outline-none"
        >
          {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
      <button type="submit" disabled={loading} className="bg-black text-white font-medium p-2 mt-6 rounded hover:opacity-85 w-full">
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div className="mt-2 ml-1 text-sm text-[#8a8a8a]">
        Já possui uma conta?{' '}
        <button 
          type="button" 
          className="font-bold text-black hover:underline"
          onClick={() => router.push('/login')}
        >
          Faça login
        </button>
      </div>
    </form>
  );
};

export default RegisterForm; 