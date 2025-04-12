export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold text-center">
        欢迎来到我的 Next.js 网站!
      </h1>
      <p className="mt-4 text-center text-gray-600">
        这是使用 Next.js {process.env.npm_package_dependencies_next} 创建的页面
      </p>
    </main>
  )
}