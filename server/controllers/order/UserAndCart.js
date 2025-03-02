import User from "../../models/userModel.js";

export const addUserAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { city, state, homeNumber, pinCode, landmark } = req.body;

    // Validate that required fields are provided
    if (!city || !state) {
      return res.status(400).json({ message: "City and State are required" });
    }

    const address = {
      city,
      state,
      homeNumber,
      pinCode,
      landmark
    };

    // Update user's address, replacing the existing address
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { addresses: [address] }, // Replace with the new address
      { new: true } // Return the updated user
    ).select('-password')

    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
