import puppeteer from "puppeteer";
import fs from "fs";
import { ChatGPTAPI } from "chatgpt";

const api = new ChatGPTAPI({
    apiKey: "sk-None-OEvjEkIQtMgURjXGSVoxT3BlbkFJG4WnvlzsG23Rp78Xztlg",
});

async function getTextGPT(line, type) {
    if (type === "gaigoi") {
        const res =
            await api.sendMessage(`Viết lại đoạn văn dưới đây, thành đoạn văn khác hoàn toàn với đoạn văn mẫu, để mở đầu cho bài viết: ${line}
            Giá: 130k
            tuổi: 19 tuổi
            ngoại hình:
            Cao 1m62
            nặng 51 kg
            Số đo: 90, 60, 90
            Làm việc 24/24 (Qua đêm thỏa thuận).
            Dịch vụ
            HJ, BJ, tắm chung, dọn WC, qua đêm. Em gái Hot girl xinh đẹp dù em có không mặc gì thì vẫn toát lên vẻ đẹp của người con gái Việt Nam. Anh em muốn nhẹ nhàng, cảm xúc cứ liên hệ đến Em gái để nhận số điện thoại của Em gái sexy gợi cảm. Muốn tìm gái chat sex cũng có thể liên hệ với em tiếp 24/7.
            Tuyệt đối không đưa ra dạng thẻ ul, li mà được phép đưa ra dạng thẻ p của html`);
        // consolog(res.text);
        return res.text;
    } else {
        const res =
            await api.sendMessage(`Viết đoạn văn chất lượng, để mở đầu cho bài viết ${line}
            Trong đoạn văn mở đầu của bài viết phải có chứa từ khóa ${line} của bài viết.
            Đoạn văn phải có độ dài 100 đến 160 từ
            Từ khóa nằm trong đoạn văn không vượt quá 2 từ khóa
            Trả lời bằng tiếng việt và đưa ra dạng thẻ p của html`);
        return res.text;
    }
}
const auto = async (data) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-features=site-per-process"],
        ignoreDefaultArgs: ['--enable-automation'],
        // PUPPETEER_DISABLE_HEADLESS_WARNING: true
    });
    try {
        let {
            line,
            urlVideo,
            type,
            url,
            username,
            password,
            editor,
            acffield1,
            acffield2,
            detailsALT,
            text,
        } = data;

        // Launch the browser and open a new blank page
        let urlIMG;
        const page = await browser.newPage();

        // Navigate the page to a URL
        await page.goto(`https://${url}/trafficphuongday?preview=1`);

        // Set screen size
        await page.setViewport({ width: 1920, height: 1080 });

        // Type into search box
        await page.type("#user_login", username);
        await page.type("#user_pass", password);

        // Wait and click on first result
        const searchResultSelector = "#wp-submit";
        await page.waitForSelector(searchResultSelector);
        await page.click(searchResultSelector);

        await page.waitForSelector(10000);
        //   await browser.newPage();
        await page.goto(`https://${url}/wp-admin/post-new.php`);

        await page.evaluate(async (line) => {
            const element = document.querySelector("#title");

            // Check if the element exists
            if (element) {
                element.value = line;
            }
        }, line);
        // await page.type("#title", line);
        await page.click("#content-tmce");
        await page.waitForSelector(2000);

        const nameUrl = await page.evaluate(async (line) => {
            const element = document.querySelector("#editable-post-name");

            // Check if the element exists
            if (element) {
                return element.innerHTML;
            } else {
                return "Not Found Title";
            }
        }, line);

        await page.waitForSelector("#set-post-thumbnail");
        await page.click("#set-post-thumbnail");

        await page.waitForSelector("#media-search-input");
        await page.type("#media-search-input", text);

        await page.waitForSelector(5000);

        const temp = await page.evaluate(async () => {
            const element = document.querySelector(
                "#__attachments-view-53 > li > div > div"
            );
            let linkUrl = document.querySelector(
                "#__attachments-view-53 > li > div > div > div > img"
            );
            if (element) {
                element.click();
            }
            if (linkUrl) {
                linkUrl = linkUrl.getAttribute("src");
            }
            return linkUrl;
        });

        if (temp) {
            urlIMG = temp;
        }
        // // nameUrl
        await page.type("#attachment-details-title", nameUrl);

        // // ghi details-title"
        await page.evaluate(async (nameUrl) => {
            const inputElement = document.querySelector("#attachment-details-title");

            if (inputElement) {
                // Set the value of the input element
                inputElement.value = nameUrl;
            } else {
                console.error('Element with ID "#attachment-details-title" not found');
            }
        }, nameUrl);

        // // details-alt-text
        await page.evaluate(async (detailsALT) => {
            const element = document.querySelector("#attachment-details-alt-text");
            if (element) {
                element.value = detailsALT;
                const stepbystep = document.querySelector(
                    "#__wp-uploader-id-0 > div.media-frame-toolbar > div > div.media-toolbar-primary.search-form > button"
                );
                if (stepbystep) {
                    stepbystep.click();
                }
            } else {
                return 'Element with ID "attachment-details-alt-text" not found';
            }
        }, detailsALT);

        await page.waitForSelector("#acf-editor-35-html");
        await page.click("#acf-editor-35-html");

        const test = await getTextGPT(line, type);

        if (type == "gaigoi") {
            if (test.includes("</p>")) {
                if (test.includes("</ul>")) {
                    const indexP = test.indexOf("</ul>");
                    const modifiedTest =
                        test.slice(0, indexP + 4) +
                        `<p style="text-align: center;"><img class="size-full wp-image-10836 aligncenter" src="${urlIMG}" alt="${text}" width="500" height="721" /></p> [[PASS_EMBED]]` +
                        test.slice(indexP + 4);

                    await page.evaluate(
                        async (modifiedTest, line) => {
                            const element = document.querySelector("#acf-editor-35");
                            if (element) {
                                element.value = `<p>${line}</p> ${modifiedTest}`;
                            } else {
                                return "Not Found Title#acf-editor-35";
                            }
                        },
                        modifiedTest,
                        line
                    );
                }
            } else {
                const index = test.indexOf("</p>");

                const modifiedTest =
                    test.slice(0, index + 4) +
                    `<p style="text-align: center;"><img class="size-full wp-image-10836 aligncenter" src=${urlIMG} alt=${text} width="500" height="721" /></p> [[PASS_EMBED]]` +
                    test.slice(index + 4);

                await page.evaluate(
                    async (modifiedTest, line) => {
                        const element = document.querySelector("#acf-editor-35");
                        if (element) {
                            element.value = `<p>${line}</p> ${modifiedTest}`;
                        } else {
                            return "Not Found Title#acf-editor-35";
                        }
                    },
                    modifiedTest,
                    line
                );
            }
        } else {
            await page.evaluate(
                async (line, urlVideo, test) => {
                    const element = document.querySelector("#acf-editor-35");
                    if (element) {
                        element.value = `<p>${line}<p/> ${urlVideo} ${test}`;
                    } else {
                        return "Not Found #acf-editor-35";
                    }
                },
                line,
                urlVideo,
                test
            );
        }

        await page.type("#acf-field_5c68fcecda775", acffield1);

        await page.type("#acf-field_6489d69f4ad13", acffield2);

        if (type == "gaigoi") {
            await page.waitForSelector("#in-category-141");
            await page.click("#in-category-141");
        } else {
            await page.waitForSelector("#in-category-1");
            await page.click("#in-category-1");

            await page.waitForSelector("#in-category-252");
            await page.click("#in-category-252");

            await page.waitForSelector("#in-category-253");
            await page.click("#in-category-253");
        }

        await page.waitForSelector("#publish");
        await page.click("#publish");

        await page.waitForTimeout(5000);

        console.log("Thành công!")
        await browser.close();
    } catch (error) {
        await browser.close();
    }
};

async function main(type) {
    const fileContent = fs.readFileSync("filedulieu.txt", "utf-8");
    const lines = fileContent.split("\n");

    if (type === "gaigoi") {
        for (let i = 0; i < 3; i++) {
            const line = lines[i];
            const data = {
                type: "gaigoi",
                text: `hinh_${i + 1}`,
                line: line,
                acffield1:
                    "0367.871.58n. Mmmmmmmmmmmmm mmmmmm cảm ơn bạn đã làm theo hướng dẫn để lấy số ĐT và xem được clip, link đây bạn nhé https://taiday.alogai.to",
                acffield2:
                    "NHẬP SỐ VÀO Ô BÊN DƯỚI SẼ XUẤT HIỆN SỐ ĐIỆN THOẠI CỦA EM GÁI GỌI MÀ CÁC ANH ĐANG CẦN SỐ ĐIỆN THOẠI, CHƠI EM GIÁ 130K/LẦN ANH NHÉ, DO MỚI MỞ ĐANG CÓ GIẢM GIÁ 65%. VÌ TÍNH CHẤT BẢO MẬT MONG CÁC ANH THÔNG CẢM LÀM THEO HƯỚNG DẪN ANH NHÉ.",
                detailsALT: line,
                username: "songiada",
                password: "0902884459dDucnNN102",
                url: "alogai.top",
            };
            await auto(data);
        }
    } else {
        
        const fileContentVideo = fs.readFileSync("video.txt", "utf-8");
        const lineContent = fileContentVideo.split("\n");
        for (let i = 0; i < 1; i++) {
          const line = lines[i];
          const data = {
            type: "gaigoi",
            text: `anh_${i+1}`,
            line: line,
            urlVideo: lineContent[i],
            acffield1:
              "mmmmmmmmmmmmm mmmmmm Cảm ơn bạn đã làm theo hướng dẫn để xem được clip, link đây bạn nhé https://taiday.alogai.top",
            acffield2:
              "ANH EM LÀM THEO HƯỚNG DẪN NHƯ DƯỚI ĐÂY ĐỂ LẤY MÃ SỐ CHỨNG MINH TRÊN 18 TUỔI ĐỂ XEM TRỌN BỘ CLIP ( VIDEO) NÀY. VÌ TÍNH CHẤT AN TOÀN CHO ANH EM, MONG ANH EM THÔNG CẢM LÀM THEO HƯỚNG DẪN DƯỚI ĐÂY.",
            detailsALT: line,
            username: "songiada",
            password: "0902884459dDucnNN102",
            url: "alogai.top",
          };
          await auto(data);
        }
      }
}

main("gaigoi");
