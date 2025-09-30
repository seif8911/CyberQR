export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export interface ImgBBUploadResult {
  success: boolean;
  url?: string;
  display_url?: string;
  thumb_url?: string;
  medium_url?: string;
  delete_url?: string;
  error?: string;
}

export const imgbbService = {
  async uploadImage(file: File, expiration?: number): Promise<ImgBBUploadResult> {
    try {
      const apiKey = process.env.IMGBB_API_KEY;
      
      if (!apiKey) {
        throw new Error('IMGBB_API_KEY is not configured');
      }

      // Create form data with the file directly
      const formData = new FormData();
      formData.append('key', apiKey);
      formData.append('image', file);
      
      if (expiration) {
        formData.append('expiration', expiration.toString());
      }

      // Upload to imgBB
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const result: ImgBBResponse = await response.json();

      if (!result.success) {
        throw new Error('Upload failed');
      }

      return {
        success: true,
        url: result.data.url,
        display_url: result.data.display_url,
        thumb_url: result.data.thumb.url,
        medium_url: result.data.medium.url,
        delete_url: result.data.delete_url,
      };
    } catch (error) {
      console.error('ImgBB upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  async uploadProfilePicture(file: File, userId: string): Promise<ImgBBUploadResult> {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }

      // Set expiration to 1 year (31536000 seconds)
      const expiration = 31536000;
      
      return await this.uploadImage(file, expiration);
    } catch (error) {
      console.error('Profile picture upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  async uploadQRImage(file: File): Promise<ImgBBUploadResult> {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      // Set expiration to 1 month (2592000 seconds)
      const expiration = 2592000;
      
      return await this.uploadImage(file, expiration);
    } catch (error) {
      console.error('QR image upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }
};
