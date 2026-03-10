const express = require('express');
const Listing = require('../models/Listing');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET all listings (Public)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    console.error('Fetch Listings Error:', error);
    res.status(500).json({ message: 'Server error fetching listings' });
  }
});

// GET current user's listings (Protected)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find({ author: req.user.userId })
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    console.error('Fetch My Listings Error:', error);
    res.status(500).json({ message: 'Server error fetching your listings' });
  }
});

// GET listing by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('author', 'firstName lastName _id');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching listing' });
  }
});

// POST new listing (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, location, imageUrl, description, price } = req.body;

    if (!title || !location || !imageUrl || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newListing = new Listing({
      title,
      location,
      imageUrl,
      description,
      price,
      author: req.user.userId,
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    console.error('Create Listing Error:', error);
    res.status(500).json({ message: 'Server error creating listing' });
  }
});

// PUT update listing (Protected, ownership required)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this listing' });
    }

    const { title, location, imageUrl, description, price } = req.body;
    listing.title = title ?? listing.title;
    listing.location = location ?? listing.location;
    listing.imageUrl = imageUrl ?? listing.imageUrl;
    listing.description = description ?? listing.description;
    listing.price = price !== undefined ? price : listing.price;

    await listing.save();
    res.status(200).json(listing);
  } catch (error) {
    console.error('Update Listing Error:', error);
    res.status(500).json({ message: 'Server error updating listing' });
  }
});

// DELETE listing (Protected, ownership required)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this listing' });
    }

    await listing.deleteOne();
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete Listing Error:', error);
    res.status(500).json({ message: 'Server error deleting listing' });
  }
});

module.exports = router;
