import axios from "axios"

 // Function to upload image to Cloudinary
 const uploadImageToCloudinary = async file => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'grocery-applicaiton') 

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dspe0fjlk/image/upload',
      formData
    )
    return response.data.secure_url 
  }

  export default uploadImageToCloudinary