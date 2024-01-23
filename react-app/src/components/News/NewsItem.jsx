import React from 'react';
import { Box, Text, Image, Link } from '@chakra-ui/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NewsItem = ({ articles }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    dotsClass: 'slick-dots custom-dots', // Ajoute une classe personnalisée aux dots
    autoplay: true,  // Activer le défilement automatique
    autoplaySpeed: 2000,  // Définir la durée entre les diapositives en millisecondes (ici, 5 secondes)
  };

  return (
    <Box mt="20px">
      <style>
        {`
          /* Styles pour personnaliser la position des dots */
          .slick-dots.custom-dots {
            bottom: 35px;  /* Ajuste la position verticale en fonction de tes préférences */
            top: auto;     /* Assure que top est en 'auto' pour ne pas interférer avec bottom */
            left: 0px;
          }

          .slick-dots li {
            margin: 0 15px;  /* Ajuste l'espace horizontal entre les dots */
          }
        `}
      </style>

      <Slider {...settings}>
        {articles.map((article, index) => (
          <Box
            key={index}
            borderBottom="1px solid #ddd"
            mb="10px"
            pb="10px"
            boxSizing="border-box"
            maxW="300px"
          >
            <Text fontSize="16px" m="0">
              {article.title}
            </Text>
            {article.urlToImage && (
              <Image
                src={article.urlToImage}
                alt={article.title}
                w="100%"
                h="auto"
                mt="10px"
              />
            )}
            <Text m="5px 0" fontSize="14px">
              Auteur: {article.author}
            </Text>
            <Text m="5px 0" fontSize="14px">
              Date de publication: {new Date(article.publishedAt).toLocaleDateString()}
            </Text>
            <Text m="5px 0" fontSize="14px">
              Source: {article.source.name}
            </Text>
            <Text m="5px 0" fontSize="14px">
              Lien: <Link href={article.url} target="_blank" rel="noopener noreferrer">Lien vers l'article</Link>
            </Text>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default NewsItem;
