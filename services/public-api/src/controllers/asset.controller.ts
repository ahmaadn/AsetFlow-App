import { Request, Response } from 'express';

import * as AssetService from '../services/asset.service';

/**
 * Redirect to asset URL (Cloudinary)
 */
export const redirectToAsset = async (req: Request, res: Response) => {
  try {
    const { slugFolder, slugAsset } = req.params;

    const asset = await AssetService.getAssetBySlug(slugFolder, slugAsset);

    if (!asset) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested asset does not exist',
      });
    }

    // Redirect to Cloudinary URL
    return res.redirect(301, asset.url);
  } catch (error) {
    console.error('Error in redirectToAsset:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request',
    });
  }
};

/**
 * Get all assets in folder
 */
export const getAssetsByFolder = async (req: Request, res: Response) => {
  try {
    const { slugFolder } = req.params;
    const { type } = req.query;

    const result = await AssetService.getAssetsByFolder(
      slugFolder,
      type as string | undefined
    );

    if (!result) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested folder does not exist',
      });
    }

    // Build response with asset URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/v1/${slugFolder}`;
    const response: Record<string, string> = {};

    for (const asset of result.assets) {
      response[asset.slug] = `${baseUrl}/${asset.slug}`;
    }

    return res.json(response);
  } catch (error) {
    console.error('Error in getAssetsByFolder:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request',
    });
  }
};
