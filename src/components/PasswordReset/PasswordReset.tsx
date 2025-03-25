// import { useLogin } from '../../features/dashboard/presentation/hooks/useLogin';

// export default function PasswordResetForm() {
//   const { formData, handleSubmit, handleChange, error } = useLogin();

//   return (
//     <div className="relative min-h-screen">
//       {/* Capa de fondo con la imagen */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm brightness-50"
//         style={{
//           backgroundImage: 'url("/traerd1.jpg")'
//         }}
//       />
      
//       {/* Contenido del formulario */}
//       <div className="relative flex justify-center items-center min-h-screen">
//         <div className="h-[400px] flex w-[800px] shadow-sm rounded-lg bg-white/90"> 
//           <div className="flex w-[1024px]">
//             {/* Panel izquierdo */}
//             <div 
//               className="hidden lg:flex lg:w-1/2 h-auto relative overflow-hidden rounded-l-lg"
//               style={{
//                 backgroundImage: 'url("/traerd2.png")',
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 backgroundRepeat: 'no-repeat'
//               }}
//             >
//               {/* Capa de superposición para mejorar legibilidad si es necesario */}
//               <div className="absolute inset-0 bg-custom-blue/10"></div>
//             </div>

//             {/* Panel derecho - formulario */}
//             <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//               <div className="w-full max-w-md">
//                 <h2 className="text-4xl font-semibold text-gray-700 mb-8">LOGIN</h2>

//                 {error && <div className="text-red-500 mb-4">{error}</div>}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="shadow-sm">
//                     <input
//                       type="email"
//                       name="username"
//                       placeholder="correo@trae.rd"
//                       value={formData.username}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border-b border-gray-300 focus:border-custom-blue focus:outline-none transition-all duration-300 hover:shadow-md"
//                       required
//                     />
//                   </div>

//                   <div className="shadow-sm">
//                     <input
//                       type="password"
//                       name="password"
//                       placeholder="Contraseña"
//                       value={formData.password}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border-b border-gray-300 focus:border-custom-blue focus:outline-none transition-all duration-300 hover:shadow-md"
//                       required
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id="remember"
//                         className="w-4 h-4 text-custom-blue border-gray-300 rounded focus:ring-custom-blue"
//                       />
//                       <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
//                         Recórdarme
//                       </label>
//                     </div>
//                     <a href="#" className="text-sm text-custom-blue hover:text-custom-blue-light transition-colors">
//                       ¿Olvidaste tu contraseña?
//                     </a>
//                   </div>

//                   <button
//                     type="submit"
//                     className="w-full py-3 px-4 bg-custom-blue hover:bg-custom-blue-light text-white font-medium rounded-lg transition-colors"
//                   >
//                     Acceder
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//esto no sirve