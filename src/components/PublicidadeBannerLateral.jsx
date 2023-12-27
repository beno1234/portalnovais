import React, { useEffect, useState, useCallback } from "react";

import { getFile } from "../store/actions/file";

const PublicidadeBannerLateral = ({ data }) => {
  const [image, setImage] = useState("");

  const onFetchImage = useCallback(async (id) => {
    const response = await getFile(id);
    if (response) setImage(response);
  }, []);

  useEffect(() => {
    data && onFetchImage(data.cover);
  }, [data, onFetchImage]);

  if (data.type !== "miniBanner") {
    return null;
  }

  return (
    <a href={data.site}>
      <img
        alt={data.name}
        className={`ui centered image ${data.type} banner`}
        src={image}
        style={{ marginTop: "1em", marginBottom: "1em" }}
      />
    </a>
  );
};

export default PublicidadeBannerLateral;
