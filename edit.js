import axios from "axios";

// const url = "https://alogai.top/wp-admin/edit-tags.php";

const sendUpdate = async (url,action, tagId, taxonomy, wpnonce, description, wpseo_desc, headers) => {
    const formData = new URLSearchParams();
    formData.append("action", action);
    formData.append("tag_ID", tagId);
    formData.append("taxonomy", taxonomy);
    formData.append("_wpnonce", wpnonce);
    formData.append("description", description);
    formData.append("wpseo_desc", wpseo_desc);

    try {
        const response = await axios.post(`https://${url}wp-admin/post-new.php`, formData, { headers });
        return response.status;
    } catch (error) {
        return false;
    }
};

export { sendUpdate };
