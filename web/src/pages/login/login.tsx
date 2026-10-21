import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      setError(typeof message === 'string' ? message : JSON.stringify(message))
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="flex flex-col space-y-5 rounded-3xl bg-card p-10 w-full text-ink mt-64">
      <div className=" text-xl font-bold text-amber-600"> LOGIN </div>
      {error && (
        <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-rose-800 font-medium">{error}</div>
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className=" text-start">
          <label>
            อีเมล (Email)
          </label>
          <div>
            <input
              className="shadow appearance-none border border-white-500 rounded w-full py-2 px-3 text-white-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
        </div>
        <div className="text-start">
          <label>
            รหัสผ่าน (Password)
          </label>
          <div>
            <input
              className="shadow appearance-none border border-white-500 rounded w-full py-2 px-3 text-white-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className=" w-full font-bold flex justify-center bg-accent rounded-2xl py-3  text-zinc-900"
        >
          {loading ? (<>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span> กำลังเข้าสู่ระบบ...</span>
          </>) : (<>
            <span>เข้าสู่ระบบ </span>
          </>)}
        </button>
      </form>

    </div>
  )
}