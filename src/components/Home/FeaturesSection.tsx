import { FeatureLayout } from "./FeatureSection/FeatureLayout";
import { FeatureText } from "./FeatureSection/FeatureText";
import { FeatureLogo } from "./FeatureSection/FeatureLogo";
import FeatureQuadrant from "./FeatureSection/Featurequadrant";
import { DollarSign } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="px-6 relative">
      <div className="max-w-7xl mx-auto  ">

        <FeatureLayout>
          <FeatureText
            title="Impulsando el futuro del dinero"
            description={
              <>
                Hunboli es una de las monedas estables más adoptadas del
                ecosistema blockchain, brindando una base sólida,
                estable y programable para innovadores.
                <br /><br />
                Actúa como un puente digital confiable entre monedas
                y blockchains.
              </>
            }
            buttonText="Descubre cómo funciona Hunboli"
          />

          <FeatureLogo imageSrc="https://res.cloudinary.com/dnbklbswg/image/upload/v1767889917/icon0_pcqbuj.svg" />


        </FeatureLayout>

        <FeatureLayout reverse>


          <FeatureText
            title="100% respaldada y totalmente transparente"
            description={
              <>
                Cada token de Hunboli está respaldado 1:1 por moneda
                fiduciaria y equivalentes de efectivo.
                <br /><br />
                Al canjear tus Hunbolis, recibes el valor real del
                token con total confianza.
              </>
            }
            buttonText="Ver página de transparencia"
          />

          <FeatureQuadrant
            topLeftImage="https://res.cloudinary.com/dnbklbswg/image/upload/v1767965043/apple-icon-removebg-preview_cjptux_lblrr0.png"
            bottomRightSVG={<DollarSign className="w-10 h-10 text-teal-500" />}
            size={300}
          />

        </FeatureLayout>

      </div>
    </section>
  );
}
