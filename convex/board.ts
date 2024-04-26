import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { svg1, svg2, svg3, svg4, svg5, svg6, svg7, svg8, svg9, svg10, svg11, svg12, svg13, svg14, svg15 } from "../assets/index"

const images = [
    svg1, 
    svg2, 
    svg3, 
    svg4, 
    svg5, 
    svg6, 
    svg7, 
    svg8, 
    svg9, 
    svg10, 
    svg11, 
    svg12, 
    svg13, 
    svg14, 
    svg15
]

export const create = mutation(
    {
        args: {
            orgId: v.string(),
            title: v.string()
        },
        handler: async(ctx, args) => {
            const identity = await ctx.auth.getUserIdentity();

            if(!identity){
                throw new Error("Unauthorized!!");
            }
            const randomImage = images[Math.floor(Math.random() * images.length)];

            const board = ctx.db.insert("boards",{
                title: args.title,
                orgId: args.orgId,
                authorId: identity.subject,
                authorName: identity.name || "",
                imageUrl: randomImage
            });
            return board;
        },
    }
)