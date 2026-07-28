import data from "@/app/data/sante-voyage.json";
import { Reveal } from "@/components/sante-voyage/reveal";

import { ChapterHeading } from "./article-ui";
import {
  FoodAndWaterAdvice,
  MosquitoAndRodentAdvice,
} from "./during-travel-basics";
import {
  AltitudeAdvice,
  JetLagAdvice,
  PhlebitisAdvice,
} from "./during-travel-transport";

export function DuringTravelSection() {
  return (
    <section id="pendant-le-voyage" className="scroll-mt-32 py-14 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-16">
          <Reveal>
            <ChapterHeading
              num="03"
              label="Étape n°3"
              title={data.pendant.title}
            />
          </Reveal>
          <MosquitoAndRodentAdvice />
          <FoodAndWaterAdvice />
          <PhlebitisAdvice />
          <AltitudeAdvice />
          <JetLagAdvice />
        </div>
      </div>
    </section>
  );
}
