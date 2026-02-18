export default function Home() {
  return (
    <main className="main">
      <div className="hero">
        <h1 className="title">
          Welcome to <span className="highlight">BurnBox</span>
        </h1>
        <p className="description">
          A Next.js application running on Azure Web App
        </p>
      </div>

      <div className="grid">
        <a
          href="https://nextjs.org/docs"
          className="card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>Documentation &rarr;</h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://learn.microsoft.com/en-us/azure/app-service/"
          className="card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>Azure App Service &rarr;</h2>
          <p>Learn about hosting web apps on Azure App Service.</p>
        </a>

        <a
          href="https://nextjs.org/learn"
          className="card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>Learn &rarr;</h2>
          <p>Learn about Next.js with an interactive course.</p>
        </a>

        <a
          href="https://github.com"
          className="card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>Deploy &rarr;</h2>
          <p>Set up CI/CD with GitHub Actions for Azure deployment.</p>
        </a>
      </div>
    </main>
  );
}
