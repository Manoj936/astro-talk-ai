import bcrypt from "bcryptjs";

export async function hashPassword(password:string, saltRounds:number): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

export async function verrifyPassword(password:string , hashedPassword:string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}