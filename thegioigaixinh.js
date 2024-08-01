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
        const sendReq = await axios.get("https://thegioigaixinh.vip/wp-json/wp/v2/tags?page=15&per_page=20");
        const cookie = await getCookie("thegioigaixinh.vip","songiada","0902884459dDucnNN0")
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie
        };
        if (sendReq.data) {
            for (let i = 0; i < sendReq.data.length; i++) {
                const nonce = await getNonce(sendReq.data[i].id,'thegioigaixinh.vip', headers);
                if (nonce) {
                    // Request content from ChatGPT API based on a prompt
                    const res = await api.sendMessage(`Viết 1 đoạn văn ngắn không quá 150 từ chất lượng để mở đầu cho tiêu đề: ${sendReq.data[i].name} và đưa ra dạng html trong thẻ p trả lời bằng tiếng việt.  
                    Trong đoạn văn ngắn phải có chứa 1 đến 2 từ khóa  ${sendReq.data[i].name} và không được vượt quá 2 từ khóa.
                    Trong đoạn văn ngắn không chứa các ký tự (), không chứa các ký tự (:), không chứa các ký tự (;), không chứa các ký tự (-).
                    In đậm từ khóa ${sendReq.data[i].name}, nhưng chỉ được phép in đậm từ khóa một lần trong đoạn văn ngắn, không được phép in đậm hai lần trong đoạn văn.
                    Đưa ra dạng html trong thẻ p trả lời bằng tiếng việt.`);
                    
                    const resCeo  = await api.sendMessage(`Hãy viết 1 đoạn văn ngắn 100 đến 140 kí tự, để mô tả cho ${sendReq.data[i].name}.
                    Trong đoạn văn ngắn này phải có chứa một từ khóa ${sendReq.data[i].name}
                    Trong đoạn văn ngắn này không được quá hai từ ${sendReq.data[i].name}. Trả lời bằng tiếng việt`)
                    // Log the generated content
                    // console.log(res.text);

                    // Uncomment the following lines if you want to update the tags
                    const update = await sendUpdate("thegioigaixinh.vip","editedtag", sendReq.data[i].id, "post_tag", nonce, res.text, resCeo.text, headers);
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
