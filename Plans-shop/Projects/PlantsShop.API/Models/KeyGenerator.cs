using System.Security.Cryptography;

namespace PlantsShop.API.Utilities
{
    public static class KeyGenerator
    {

        // method to generate a random encryption key
        public static string GenerateEncryptionKey()
        {

            // Create a byte array to hold the key, 32 bytes for a 256-bit key
            byte[] key = new byte[32];

            // Use a using statement to ensure the RNG is properly disposed of after use
            using (var rng = RandomNumberGenerator.Create())
            {
                // Fill the byte array with cryptographically strong random bytes
                rng.GetBytes(key);
            }
            // Convert the byte array to a Base64 string for easy storage and transmission
            string base64Key = Convert.ToBase64String(key);

            // Return the Base64 encoded key as a string
            return base64Key;
        }
    }
}