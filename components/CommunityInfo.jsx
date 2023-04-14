import {
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";

const CommunityInfo = ({ community, close }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const imageHeight = new Animated.Value(220 - scrollOffset);
  // const opacity = new Animated.Value(1 - scrollOffset / 350);
  const left = imageHeight.interpolate({
    inputRange: [0, 220],
    outputRange: [80, 15],
    extrapolate: "clamp",
  });
  const bottom = imageHeight.interpolate({
    inputRange: [0, 220],
    outputRange: [28, 15],
    extrapolate: "clamp",
  });
  const size = imageHeight.interpolate({
    inputRange: [0, 220],
    outputRange: [17, 28],
    extrapolate: "clamp",
  });
  const opacity = imageHeight.interpolate({
    inputRange: [0, 220],
    outputRange: [1, 0.3],
    extrapolate: 'clamp'
  });

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);
  };

  useEffect(() => {
    console.log(opacity);
  }, [opacity])
  

  return (
    <View>
      <Animated.View
        style={{
          height: imageHeight,
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          minHeight: 80,
          zIndex: 1,
          backgroundColor: "black",
          elevation: scrollOffset == 0 ? 0 : 8,
        }}
      >
        <ImageBackground
          source={{ uri: community?.profileImage }}
          style={[
            {
              width: "100%",
              height: "100%",
              filter: "brightness(0.3)",
            },
          ]}
          resizeMode={"cover"}
        >
          <Animated.View
            style={[
              {
                width: "100%",
                height: "100%",
                position: "relative",
                backgroundColor: community?.profileImage == "https://cdn.raceroster.com/assets/images/team-placeholder.png" ? `rgba(0,0,0,.9)` : `rgba(0,0,0,.6)`,
                padding:15,
                alignItems: "center", justifyContent:"center",
              },
            ]} 
          >
            <TouchableOpacity
            onPress={()=>close()}
              style={{
                position: "absolute",
                top: 15,
                left: 15,
                zIndex: 3,
                width: 50,
                height: 50,
                backgroundColor:"rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 40,
              }}
            >
              <AntIcon name="arrowleft" size={20} color={"white"} />
            </TouchableOpacity>
            <Animated.Text
            ellipsizeMode="tail"
            numberOfLines={1}
              style={[
                {
                  fontSize: size,
                  color: "white",
                  position:scrollOffset == 0 ? "absolute" : "relative",
                bottom: scrollOffset == 0 ? 15 : 0,
                left: scrollOffset == 0 ? 15 : 0,
                  fontFamily: "bold",
                  maxWidth:"100%", 
                  width:"100%",
                  
                },scrollOffset > 0 && {width:"60%",textAlign:"center"}
              ]}
            >
              {community?.name}
            </Animated.Text>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
      <ScrollView
        contentContainerStyle={{ paddingTop: 220 }}
        onScroll={handleScroll}
      >
        <View style={{ padding: 20 }}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
            nec, ultricies sed, Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ad consequuntur quia iure doloribus libero
            cupiditate quod consectetur, inventore reiciendis pariatur quaerat,
            et tempore voluptate neque ut cumque, nihil nulla minus? Quia vero
            dignissimos nisi officiis deleniti, atque veritatis exercitationem
            quisquam molestias itaque? Excepturi quam nemo libero maxime enim
            nesciunt dolorum odit vero veritatis. Libero dolor error facilis
            quisquam illo laborum esse reiciendis, assumenda aliquid at! Aut eos
            odio debitis, dolorum porro reiciendis id, optio praesentium
            consectetur rerum amet delectus eaque cum culpa quia. Repellendus,
            vel. Et, architecto ullam totam exercitationem doloremque ad quidem.
            Enim laboriosam quod tempora dolores similique architecto, sed modi
            necessitatibus repudiandae quasi nisi velit unde consequuntur atque
            nemo. Eum debitis earum nostrum deserunt dignissimos, explicabo
            distinctio aspernatur fugit sunt molestias similique cumque
            provident quia neque nam architecto! Voluptate unde soluta, error ea
            consequatur quo aut debitis quisquam autem aperiam laboriosam fugit
            cupiditate sapiente sit sed veniam non corrupti, odio ipsum. Libero
            fugit sed cupiditate porro, totam aperiam aliquam repudiandae
            reiciendis, magni repellat hic optio praesentium exercitationem
            voluptatum dolores, quaerat beatae! Deleniti sint magnam maiores
            dicta ducimus libero, asperiores quis a illo consectetur est fugiat?
            Cupiditate accusantium maiores ea, at, cumque doloribus doloremque
            praesentium itaque alias blanditiis consectetur qui adipisci
            deleniti corporis illo, quia mollitia ut possimus totam laudantium
            atque dolore sint! Provident rem consequatur nam fugit quia.
            Accusantium autem libero, harum, perspiciatis reiciendis doloribus
            non natus voluptas consequuntur maxime tempora repellendus dolorum
            ratione. Nemo corrupti, nostrum rerum iste perspiciatis enim porro
            adipisci dolores soluta. Reprehenderit facilis ullam dicta ad
            deleniti aspernatur nostrum culpa magnam eaque veritatis asperiores
            nihil quibusdam esse nulla aliquam amet commodi sunt error nesciunt,
            quo vitae assumenda placeat, voluptatibus eos. Nulla vero odio
            incidunt consectetur praesentium aut accusantium ad cumque provident
            vel tenetur fugit eum id, doloribus ex rerum quasi quos aspernatur
            quaerat a ducimus error tempora! Magni obcaecati ab recusandae,
            dolorem eveniet praesentium earum ipsum deserunt sequi. Facere
            nesciunt repellat velit dolorem labore facilis. Nam maxime in ea
            aliquid aliquam, ullam laborum soluta voluptate totam perspiciatis
            repudiandae adipisci beatae provident cum quidem autem architecto
            dolorum rerum omnis id earum? Obcaecati ipsa labore unde corrupti
            ipsum sapiente nobis atque aut voluptas, incidunt illo facere
            consectetur sequi laudantium tenetur ullam repudiandae est
            repellendus earum quaerat vitae. Natus excepturi tempora rerum, qui
            veniam odio corporis ad reprehenderit hic, perferendis deserunt!
            Quos similique, impedit, vero maiores libero modi voluptatem odio
            magnam quas id quo autem vitae, odit explicabo qui iure incidunt vel
            ad laudantium repellat assumenda repellendus dolorum quaerat! Omnis
            inventore laboriosam iusto modi asperiores commodi perspiciatis quo,
            quis ex quibusdam magni doloremque! Magni, asperiores fuga. Officia
            dolorem praesentium provident maxime cumque ipsum quo excepturi
            tenetur ut autem. Earum sint hic atque recusandae delectus
            perferendis iste officiis dolorem nostrum aliquam, tempora adipisci
            beatae quasi vel? Deserunt nam doloribus asperiores dolorem.
            Corrupti animi consequuntur mollitia sequi voluptate suscipit
            asperiores fugiat porro obcaecati alias accusamus quaerat hic
            voluptatibus beatae, quibusdam delectus reprehenderit dolor magnam
            consectetur! Voluptate numquam, quos quisquam accusantium nam
            aliquid. Placeat pariatur minus consectetur neque corrupti, quod
            dolorum nihil repudiandae! Aliquam a exercitationem provident
            asperiores architecto vitae totam iure atque sapiente saepe.
            Perspiciatis dicta ipsam facilis non repudiandae vitae officia
            magnam dignissimos esse obcaecati excepturi atque voluptas, ab iste
            et ullam omnis minima quos quaerat, molestiae, possimus incidunt
            odit numquam! Nihil, iure odit dolor iste praesentium exercitationem
            laborum delectus earum corrupti repellendus officiis architecto
            cumque possimus! Inventore porro beatae voluptatum, nihil non itaque
            aspernatur reiciendis reprehenderit fuga consectetur maiores aperiam
            expedita libero quam possimus atque officia, assumenda, earum
            perspiciatis maxime. Reiciendis nesciunt aperiam totam atque
            deleniti at quibusdam eos, pariatur, rem commodi minima voluptate
            laborum placeat repudiandae consectetur eum accusantium nobis porro,
            eaque sunt officia. Amet, iste doloribus! Id, culpa laborum expedita
            facilis iusto, sapiente magni alias quisquam quo veritatis eos
            cumque placeat fugiat natus incidunt labore, modi quidem sit minima.
            Aliquam quas nihil tempora alias dolore cupiditate consequuntur, at
            voluptatem maxime, similique delectus quae quia deserunt nesciunt
            incidunt tenetur a facere sed fugiat ea labore? Praesentium id
            laborum beatae, numquam fugit impedit! Sit suscipit molestias saepe
            voluptate, obcaecati nesciunt laboriosam sint, fuga, sunt
            exercitationem illo incidunt a beatae cupiditate maxime earum
            debitis omnis hic quae. Iste reiciendis repudiandae consectetur hic
            voluptatibus adipisci possimus perspiciatis praesentium fugiat
            libero voluptatum eligendi minima, nulla accusamus, accusantium quos
            ipsam. Dicta placeat non culpa ex magni magnam nobis. Quisquam
            explicabo hic optio nisi, eos temporibus, quae sed nihil molestias
            harum nam! Enim, eaque rem. Fuga, unde. Corporis eius eveniet,
            tempore nostrum voluptatibus incidunt dicta, provident non odio quas
            ipsa. Corrupti quis velit temporibus alias sit minus consequatur
            maxime eaque eum repellendus. Quo quas facilis debitis quia
            aspernatur nesciunt illum, minima ea necessitatibus omnis deserunt
            temporibus dolorum velit tempore placeat amet ab labore, quam
            dolores? Odit repellat et commodi, a illo est consequuntur.
            Accusamus natus illum architecto ut maxime reiciendis nobis odit.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityInfo;

const styles = StyleSheet.create({});
