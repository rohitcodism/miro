
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


            //TODO: Make the delete function more secure and more authorized

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

export const doFavorite = mutation(
    {
        args: {
            boardId: v.id("boards"),
            orgId: v.string()
        },
        handler: async(ctx, args) => {
            const userIdentity = await ctx.auth.getUserIdentity();

            if(!userIdentity){
                throw new Error("Unauthorized!!")
            }

            const board = await ctx.db.get(args.boardId);

            if(!board){
                throw new Error("Item not found!!");
            }

            const userId = userIdentity?.subject;

            const existingFavorite = await ctx.db
            .query('userFavorites')
            .withIndex('by_user_board_org', (q) => 
                q.eq("userId", userId)
                .eq("boardId", board._id)
                .eq("orgId", args.orgId)
            )
            .unique()

            if(existingFavorite){
                throw new Error("Board already favorited")
            }

            const newFavoriteBoardId = await ctx.db.insert("userFavorites", {
                orgId: args.orgId,
                userId: userId,
                boardId: board._id
            })

            if(!newFavoriteBoardId){
                throw new Error("Error! in favoriting the board")
            }

        }
    }
)

export const undoFavorite = mutation(
    {
        args: {
            boardId: v.id("boards"),
        },
        handler: async(ctx, args) => {
            const userIdentity = await ctx.auth.getUserIdentity();

            if(!userIdentity){
                throw new Error("Unauthorized!!")
            }

            const board = await ctx.db.get(args.boardId);

            if(!board){
                throw new Error("Item not found!!");
            }

            const userId = userIdentity?.subject;

            const existingFavorite = await ctx.db //* Flag */
            .query('userFavorites')
            .withIndex('by_user_board', (q) => 
                q.eq("userId", userId)
                .eq("boardId", args.boardId)
            )
            .unique()

            if(!existingFavorite){
                throw new Error("Board is not in the favorited list")
            }

            try {
                await ctx.db.delete(existingFavorite._id)
            } catch (error) {
                throw new Error("Error! in removing a board from favorites")
            }

        }
    }
)