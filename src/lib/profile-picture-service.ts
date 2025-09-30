export interface UploadResponse {
  success: boolean;
  url?: string;
  display_url?: string;
  thumb_url?: string;
  medium_url?: string;
  delete_url?: string;
  message: string;
  error?: string;
}

export const profilePictureService = {
  async uploadProfilePicture(userId: string, file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return result;
    } catch (error) {
      console.error('Profile picture upload error:', error);
      return {
        success: false,
        message: 'Failed to upload profile picture',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async deleteProfilePicture(deleteUrl: string): Promise<UploadResponse> {
    try {
      const response = await fetch('/api/upload-profile-picture', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      return result;
    } catch (error) {
      console.error('Profile picture deletion error:', error);
      return {
        success: false,
        message: 'Failed to delete profile picture',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

