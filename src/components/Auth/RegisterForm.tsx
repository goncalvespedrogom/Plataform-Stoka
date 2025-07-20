import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/router";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Cadastro realizado com sucesso! Redirecionando para login...");
      setEmail("");
      setPassword("");
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

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 max-w-sm mx-auto p-0 bg-transparent shadow-none border-none w-full">
      <h2 className="text-4xl font-bold text-[#000000ee]">Crie sua conta,</h2>
      <p className="text-[#8a8a8a] mt-[-.8rem] mb-6">preencha seus dados para começar.</p>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border p-2 px-4 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 w-full"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border p-2 px-4 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 w-full"
      />
      <button type="submit" disabled={loading} className="bg-black text-white font-medium p-2 mt-6 rounded hover:opacity-85 w-full">
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div className="mt-2 ml-1 text-sm text-[#8a8a8a]">
        Já possui uma conta?{' '}
        <button type="button" className="font-bold text-black hover:underline">Faça login</button>
      </div>
    </form>
  );
};

export default RegisterForm; 