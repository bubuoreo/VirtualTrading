import React from 'react';
import { Box, Text, Image, Link, Grid, GridItem } from '@chakra-ui/react';

const NewsItem = ({ articles }) => {
  const articlesPerColumn = 3; // Nombre d'articles par colonne

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {articles.map((article, index) => (
        <GridItem key={index}>
          <Box
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
        </GridItem>
      ))}
    </Grid>
  );
};

export default NewsItem;
