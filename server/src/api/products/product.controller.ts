import { Request, Response, NextFunction } from 'express';
import * as productService from "./product.service";

/**
 * Controller for fetching paginated products
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const data = await productService.fetchPaginatedProducts({ page });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for fetching a single product by ID
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      res.status(404).json({ message: `Product with ID ${id} not found` });
      return;
    }
    
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}; 