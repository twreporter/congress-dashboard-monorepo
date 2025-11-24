-- update from ['slug-1'] to [{ type: 'www-article', slug: 'slug-1' }]
UPDATE `Topic` p
SET p.`relatedTwreporterArticles` = (
  SELECT JSON_ARRAYAGG(
           JSON_OBJECT(
             'type', 'www-article',
             'slug', jt.slug
           )
         )
  FROM JSON_TABLE(
    p.`relatedTwreporterArticles`,
    '$[*]' COLUMNS (
      slug VARCHAR(255) PATH '$'
    )
  ) AS jt
)
-- only touch rows that are still in the *old* shape: array of strings
WHERE JSON_TYPE(p.`relatedTwreporterArticles`) = 'ARRAY'
  AND JSON_LENGTH(p.`relatedTwreporterArticles`) > 0
  AND JSON_TYPE(JSON_EXTRACT(p.`relatedTwreporterArticles`, '$[0]')) = 'STRING';
