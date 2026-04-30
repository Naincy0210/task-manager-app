import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
const token =
req.cookies?.token ||
req.header("Authorization")?.replace("Bearer ", "");

if (!token) {
return res.status(401).json({
message: "No token, authorization denied",
});
}

try {
const decoded = jwt.verify(
token,
process.env.JWT_SECRET || "secret"
) as any;

```
req.user = decoded;
next();
```

} catch (err) {
return res.status(401).json({
message: "Token is not valid",
});
}
};

export const checkRole = (roles: string[]) => {
return (req: AuthRequest, res: Response, next: NextFunction) => {
if (!req.user || !roles.includes(req.user.role)) {
return res.status(403).json({
message: "Access denied: insufficient permissions",
});
}
next();
};
};
