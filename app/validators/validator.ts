
import { NextFunction, Request, Response } from 'express'
import { body, check, validationResult, ValidationError, ValidationChain, Result } from 'express-validator'


export const expressValidator = (req: Request , res:Response , next: NextFunction): any => {
	const errors: Result<ValidationError> = validationResult(req)
	const messages: ValidationError[] = []
	if (!errors.isEmpty()) {
		for (const i of errors.array()) {
			messages.push(i)
		}
   		return res.status(400).send({message:'Bad Request', data:errors, status:400})
    
	}
    next()
}

//post item input validator
export const postItemValidator = (): ValidationChain[] => [
	body('quantity')
		.notEmpty().withMessage('quantity is required')
		.isNumeric().withMessage('quantity must be an positive integer')
		.isInt({ min:1}).withMessage('quantity must be greater zero'),
	body('expiry')
		.notEmpty().withMessage('expiry is required')
		.isLength({ min: 13, max: 13}).withMessage('Expiry must be 13 characters')
		.isNumeric().withMessage('quantity must be an positive integer')
]

// sell item input validator
export const sellItemValidator = (): ValidationChain[] => [
	check('quantity')
		.notEmpty().withMessage('quantity is required')
		.isNumeric().withMessage('quantity must be an positive integer')
		.isInt({ min:1}).withMessage('quantity must be greater zero')
]