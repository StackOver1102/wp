import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://alogai.top/wp-admin/term.php?taxonomy=post-new&tag_ID=658&post_type=post&wp_http_referer=%2Fwp-admin%2Fedit-tags.php%3Ftaxonomy%3Dpost-new';
// const headers = {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Cookie': `wordpress_sec_ddb63a49aaa57c43fc8425e9662c9031=songiada%7C1703735609%7CkVf3yUZ0acI7Qyoo0SehVDcrmZbWXS7mtBVj4VhzSXS%7C7a723aad369d2bff023717e2aa4a18cbee1f17fb563ea27caef629538080f2e5; wordpress_test_cookie=WP%20Cookie%20check; wordpress_logged_in_ddb63a49aaa57c43fc8425e9662c9031=songiada%7C1703735609%7CkVf3yUZ0acI7Qyoo0SehVDcrmZbWXS7mtBVj4VhzSXS%7Ceeeab0e48d803e1fd88f1c36ea7c6b394a63a80b0fb1ba5b10bb4c831c0dde74; wp-settings-4=libraryContent%3Dbrowse%26editor%3Dtinymce%26posts_list_mode%3Dlist%26mfold%3Do; wp-settings-time-4=1703562809; _ga=GA1.1.823322806.1703564836; _ga_9K675VRKVD=GS1.1.1703564836.1.0.1703564841.0.0.0`,
// };

const getNonce = async (id, url,headers) => {
    let result;
    try {
        const response = await axios.get(`https://${url}/wp-admin/term.php?taxonomy=post-new&tag_ID=${id}&post_type=post&wp_http_referer=%2Fwp-admin%2Fedit-post.php%3Ftaxonomy%3Dpost-new`, { headers });

        // Load the HTML into Cheerio
        const $ = cheerio.load(response.data);
        // console.log(response);
        // Find the input with id="_wpnonce" and get its value
        const wpNonceValue = $('#_wpnonce').val();

        // Output the value
        result = wpNonceValue;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }

    return result;
};

export { getNonce };
