const { Router } = require("express");
const Product = require("../models/Product");

const router = Router();

//rota ok
router.get("/", async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ message: "Could not get all products", error });
  }
});

//rota ok
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Product not found", error });
  }
});

//rota ok
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create({ ...req.body });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Could not create a new product", error });
  }
});

//rota ok
router.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const payload = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      payload,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Could not update this product", error });
  }
});

//rota ok
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    await Product.findByIdAndDelete(productId);
    res.status(204).json({message: "Product deleted!"});
  } catch (error) {
    res.status(500).json({ message: "Could not delete this product", error });
  }
});

module.exports = router;
