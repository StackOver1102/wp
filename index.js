import axios from "axios";
import { sendUpdate } from "./edit.js";
import { ChatGPTAPI } from 'chatgpt';
import {getNonce} from "./test.js"
import { getCookie } from "./getCookie.js";
const url = "https://alogai.top/wp-json/wp/v2/tags";
const api = new ChatGPTAPI({
    apiKey: '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'
});

const sendReq = async () => {
    try {
        const sendReq = await axios.get("https://alogai.top/trafficphuongday?preview=1");
        const cookie = await getCookie("alogai.top","songiada","0902884459dDucnNN102")
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie
        };
        if (sendReq.data) {
            for (let i = 0; i < sendReq.data.length; i++) {
                const nonce = await getNonce(sendReq.data[i].id,'alogai.top', headers);
                if (nonce) {
                    // Request content from ChatGPT API based on a prompt
                    const res = await api.sendMessage(`Viết đoạn văn chất lượng để mở đầu cho tiêu đề: ${sendReq.data[i].name} 
                    Trong đoạn văn mở đầu của bài viết phải có chứa từ khóa  ${sendReq.data[i].name} và in đậm từ khóa đó cho tôi. đưa ra dạng html trong thẻ p trả lời bằng tiếng việt`);
                    
                    const resCeo  = await api.sendMessage(`Hãy viết 1 đoạn văn ngắn từ 120 đến 140 kí tự , để mô tả: ${sendReq.data[i].name} trả lời bằng tiếng việt`)
                    // Log the generated content
                    // console.log(res.text);

                    // Uncomment the following lines if you want to update the tags
                    const update = await sendUpdate("alogai.top","editedtag", sendReq.data[i].id, "post_tag", nonce, res.text, resCeo.text, headers);
                    if (update) {
                        console.log(`Update thanh cong ${sendReq.data[i].id}`);
                    } else {
                        console.log("next" + i);
                    }
                }
            }
            console.log("Hoàn thành!!!");
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

sendReq();
