import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";

export default function NotFound() {
  return (
    <section className="section-snrc bg-snrc-light">
      <Container>
        <div className="card-snrc mx-auto max-w-3xl p-10 text-center">
          <span className="inline-flex rounded-full bg-snrc-red/10 px-3 py-1 text-sm font-semibold text-snrc-red">
            Erreur 404
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold text-snrc-dark">
            Page introuvable
          </h1>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            La page demandée n’existe pas ou a été déplacée.
          </p>

          <div className="mt-8">
            <Link to="/" className="btn-snrc-primary">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}