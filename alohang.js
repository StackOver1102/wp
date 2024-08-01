import axios from "axios";
import { sendUpdate } from "./edit.js";
import { ChatGPTAPI } from 'chatgpt';
import {getNonce} from "./test.js"
import { getCookie } from "./getCookie.js";
const url = "https://alohang.top/wp-json/wp/v2/tags";
const api = new ChatGPTAPI({
    apiKey: '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'
});

const sendReq = async () => {
    try {
        const sendReq = await axios.get("https://alohang.top/wp-json/wp/v2/tags?page=15&per_page=20");
        const cookie = await getCookie("alohang.top","songiada","0902884459dDucnNN0")
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie
        };
        if (sendReq.data) {
            for (let i = 0; i <sendReq.data.length; i++) {
                const nonce = await getNonce(sendReq.data[i].id,'alohang.top', headers);
                if (nonce) {
                    // Request content from ChatGPT API based on a prompt
                    const res = await api.sendMessage(`Viết 1 đoạn văn ngắn chất lượng để mở đầu cho tiêu đề ${sendReq.data[i].name} và đưa ra dạng html trong thẻ p trả lời bằng tiếng việt.
                    Đoạn văn mở đầu của bài viết ${sendReq.data[i].name} có độ dài 150 đến 250 từ hoặc không được vượt quá 300 từ của đoạn văn ngắn mà chatgpt tạo ra.
                    Trong đoạn văn ngắn không chứa các ký tự (), không chứa các ký tự (:), không chứa các ký tự (;), không chứa các ký tự (-).
                    Trong đoạn văn mở đầu của bài viết phải có chứa từ khóa ${sendReq.data[i].name} và in đậm từ khóa đó cho tôi.
                    Số từ khóa ${sendReq.data[i].name} trong đoạn văn mở đầu của bài viết không được nhiều hơn 2 từ khóa ${sendReq.data[i].name} trong cùng một đoạn văn. Đưa ra dạng html trong thẻ p trả lời bằng tiếng việt`);
                    
                    const resCeo  = await api.sendMessage(`Hãy viết 1 đoạn văn ngắn 90 đến 140 kí tự, để mô tả: ${sendReq.data[i].name}
                    Trong đoạn văn ngắn này phải có chứa ${sendReq.data[i].name}
                    Đoạn văn ngắn này không được quá 2 ${sendReq.data[i].name} trả lời bằng tiếng việt`)
                    // Log the generated content
                    // console.log(res.text);

                    // Uncomment the following lines if you want to update the tags
                    const update = await sendUpdate("alohang.top","editedtag", sendReq.data[i].id, "post_tag", nonce, res.text, resCeo.text, headers);
                    if (update) {
                        console.log(`Update thanh cong ${sendReq.data[i].id}`);
                    } else {
                        console.log("next" +i);
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
