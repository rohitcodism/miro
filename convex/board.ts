
import { mutation } from './_generated/server';
import { v } from 'convex/values';

const images = [
    "/placeholders/1.svg",
    "/placeholders/2.svg",
    "/placeholders/3.svg",
    "/placeholders/4.svg",
    "/placeholders/5.svg",
    "/placeholders/6.svg",
    "/placeholders/7.svg",
    "/placeholders/8.svg",
    "/placeholders/9.svg",
    "/placeholders/10.svg",
    "/placeholders/11.svg",
    "/placeholders/12.svg",
    "/placeholders/13.svg",
    "/placeholders/14.svg",
    "/placeholders/15.svg",
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

            const board = await ctx.db.insert("boards",{
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

export const remove = mutation(
    {
        args: {
            id: v.id('boards'),
        },
        handler: async(ctx, args) => {
            const identity = await ctx.auth.getUserIdentity();

            if(!identity){
                throw new Error("Unauthorized!!");
            }

            const board = await ctx.db.get(args.id);

            if(!board){
                throw new Error("Item not found");
            }

            // TODO: Later check to delete favorite user relation as well

            await ctx.db.delete(args.id);
        }
    }
);


export const editTitle = mutation(
    {
        args:{
            id: v.id("boards"),
            title: v.string()
        },
        handler: async(ctx, args) => {

            const identity = await ctx.auth.getUserIdentity();

            if(!identity){
                throw new Error("Unauthorized!!");
            }

            const board = await ctx.db.get(args.id);

            if(!board){
                throw new Error("Item not found!!");
            }

            try {
                await ctx.db.patch(args.id, { title: args.title })
            } catch (error) {
                throw new Error("Something went wrong in editing title")
            }

        }
    }
)