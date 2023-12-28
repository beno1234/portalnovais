import React, { useEffect, useState, useCallback } from "react";

import { getFile } from "../store/actions/file";

const PublicidadeBanner = ({ data }) => {
  // Adicione type como propriedade
  const [image, setImage] = useState("");

  const onFetchImage = useCallback(async (id) => {
    const response = await getFile(id);
    if (response) setImage(response);
  }, []);

  useEffect(() => {
    data && onFetchImage(data.cover);
  }, [data, onFetchImage]);

  return (
    <a href={data.site}>
      <img
        alt={data.name}
        className={`ui centered image ${data.type} banner`} // Substitua data.type por type
        src={image}
        style={{ marginTop: "1em", marginBottom: "1em" }}
      />
    </a>
  );
};

export default PublicidadeBanner;
