"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Typography from "@/components/typography";
import MediaModal from "@/components/modal/media-modal";
import DetailsCard from "@/components/card/details-card";
import { Media } from "@/types/medias";

interface Props {
  formMedias: Media[];
  setFormMedias: React.Dispatch<React.SetStateAction<Media[]>>;
}

export default function SpaceMedias({ formMedias, setFormMedias }: Props) {
  return (
    <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
      <CardHeader className="flex justify-between items-center">
        <Typography variant="h2" className="mb-0">
          Les médias
        </Typography>

        {/* Modal d'ajout */}
        <MediaModal
          onAddMedia={(media) => setFormMedias((prev) => [...prev, media])}
        />
      </CardHeader>

      <CardContent>
        {/* Aucun média */}
        {formMedias.length === 0 && (
          <p className="text-center py-4 text-primary/70 italic">
            Aucun média pour le moment.
          </p>
        )}

        {/* Liste des médias */}
        {formMedias.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formMedias.map((m, i) => (
              <DetailsCard
                key={i}
                variant="media"
                title={m.title}
                description={m.type.toUpperCase()}
                startDate={new Date()}
                media={{
                  publicId: m.publicId,
                  type: m.type,
                  width: m.width,
                  height: m.height,
                  alt: m.title,
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
