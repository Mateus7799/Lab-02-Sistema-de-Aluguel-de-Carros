import React from 'react'

function Login() {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-gray-100 p-6 shadow-sm">
        <h1 className="flex items-center justify-center font-sans text-2xl font-semibold text-black">
          Welcome Back!
        </h1>
        <p className="flex items-center justify-center p-4 font-sans text-xl font-extralight text-black">
          To stay connected with us please login in your account
        </p>
        <form className="flex flex-col items-center space-y-4" action="">
          <input
            placeholder="E-mail"
            type="text"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            Login
          </button>
          </form>
      </div>
    </div>
  )
}

export default Login
