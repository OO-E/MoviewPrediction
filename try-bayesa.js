/**
 * Created by sefasaid on 09/04/2017.
 */
var bayes = require('bayes')

var classifier = bayes()

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
mongoose.connect('mongodb://localhost/imdbcsv');
var Schema = mongoose.Schema;

var filmSchema = new Schema({

    color:{type:String},
    director_name : {type:String},
    num_critic_for_reviews: {type:Number},
    duration:{type:Number},
    director_facebook_likes : {type:Number},
    actor_3_facebook_likes : {type:Number},
    actor_2_name : {type:String},
    actor_1_facebook_likes: {type:Number},
    gross:{type:Number},
    genres:{type:String},
    actor_1_name:{type:String},
    movie_title:{type:String},
    num_voted_users:{type:Number},
    cast_total_facebook_likes:{type:Number},
    actor_3_name:{type:String},
    facenumber_in_poster:{type:Number},
    plot_keywords:{type:String},
    movie_imdb_link:{type:String},
    num_user_for_reviews:{type:Number},
    language:{type:String},
    country:{type:String},
    content_rating:{type:String},
    budget:{type:Number},
    title_year:{type:Number},
    actor_2_facebook_likes:{type:Number},
    imdb_score:{type:Number},
    aspect_ratio:{type:Number},
    movie_facebook_likes:{type:Number}

}, { timestamps: { createdAt: 'created_at', updatedAt : 'updated_at' } });
filmSchema.plugin(mongoosePaginate);
var array = [];

var Film = mongoose.model('denemee', filmSchema);
Film.find().select(['-_id','num_critic_for_reviews','duration','director_facebook_likes'
    ,'actor_3_facebook_likes','actor_1_facebook_likes','gross','num_voted_users','cast_total_facebook_likes'
    ,'facenumber_in_poster','num_user_for_reviews','budget','title_year','actor_2_facebook_likes',
    'aspect_ratio','imdb_score','movie_facebook_likes']).exec(function (err,data) {
    if(err)
        console.log(err);
    var x = 0;
    while (x < 3){
        addToTrain(data[x]);
        x++;
        if(x == 3){
            addToBatch(array,data[x+1]);
        }
    }
});

function addToTrain(input) {


    var imdb = input.imdb_score;

    var learn = [
        input.num_critic_for_reviews,
        input.duration,
        input.director_facebook_likes,
        input.actor_3_facebook_likes,
        input.actor_1_facebook_likes,
        input.gross,
        input.num_voted_users,
        input.cast_total_facebook_likes,
        input.facenumber_in_poster,
        input.num_user_for_reviews,
        input.budget,
        input.title_year,
        input.actor_2_facebook_likes,
        input.aspect_ratio,
        input.movie_facebook_likes
    ];
    classifier.learn(learn, imdb);
    // array.push(addedData);
}

function addToBatch(array,input) {

    var data = [
        input.num_critic_for_reviews,
        input.duration,
        input.director_facebook_likes,
        input.actor_3_facebook_likes,
        input.actor_1_facebook_likes,
        input.gross,
        input.num_voted_users,
        input.cast_total_facebook_likes,
        input.facenumber_in_poster,
        input.num_user_for_reviews,
        input.budget,
        input.title_year,
        input.actor_2_facebook_likes,
        input.aspect_ratio,
        input.movie_facebook_likes
    ];

    var  output =classifier.categorize(data);
    console.log(output);
}