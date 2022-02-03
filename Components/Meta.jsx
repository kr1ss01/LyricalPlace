import Head from 'next/head';

const Meta = ({ title, keywords, description, page_topic }) => {
  return (
    <Head>
        <meta httpEquiv="content-language" content="en" />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='keywords' content={keywords} />
        <meta name='description' content={description} />
        <meta name="page-topic" content={page_topic} />
        <meta name="author" content="Chris Tsiris" />
        <meta name="audience" content="Everyone" />
        <meta name="robots" content="index, follow" />
        <meta charSet='utf-8' />
        <link rel='icon' href='/Lyrical_place_icon_main.svg' />
        <title>{title} || Lyrical Place</title>
    </Head>
  )
}

Meta.defaultProps = {
  title: 'The Best Lyrical Page On The Internet',
  keywords: 'lyrics, web, lyrical place, sharing, free',
  description: 'Site for provding lyrics on songs for free. The correct place to be for lyrics!',
  page_topic: 'Media'
}

export default Meta; 

