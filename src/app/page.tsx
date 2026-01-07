import HeroAction from "./components/SeccioPrincipal/Herosection";
import Drivingfutureseccion from "./components/SeccioPrincipal/Drivingfuturesection";
import Backedtransparentsection from "./components/SeccioPrincipal/Backedtransparentsection";
import Widespreadadoptionsection from "./components/SeccioPrincipal/Widespreadadoptionsection";
import Disruptingindustrysection from "./components/SeccioPrincipal/Disruptingindustrysection";
import Faqsection from "./components/SeccioPrincipal/Faqsection";
import Layout from "./Layouts/MainLayout";

export default function HomePage() {
  return(
    <>  
        <Layout>
        <HeroAction/>
        <Drivingfutureseccion/>
        <Backedtransparentsection/>
        <Widespreadadoptionsection/>
        <Disruptingindustrysection/>
        <Faqsection/>
        </Layout>
    </>
  );
}